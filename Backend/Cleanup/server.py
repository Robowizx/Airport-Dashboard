import flask
from flask import Flask, request
import pandas as pd
import numpy as np
import re
from datetime import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/upload', methods = ["POST"])
def upload():
    uploaded_files = flask.request.files.getlist("file[]")
    for file in uploaded_files:
        extract(file)
    return ""

def extract(excel):

    ### Loading sheets into DF ###
    df = pd.read_excel(excel,skiprows=[5,9,1], sheet_name=[0,1,2],header=None)
    ### Formatting ###
    t = df[0].loc[3,[1,2]].str.extract('(\d*\s)',expand=False).astype(int)

    ### Formatting strings ###
    for x in range(3):
        df[x].loc[3,[1,2]] = df[x].loc[3,[1,2]].str.extract('(\d*\s)',expand=False).astype(int)
        df[x].loc[6] = df[x].loc[6].str.extract('(\d*\.\d+|\d+)', expand=False).astype(float)  

    ### Extracting numbers from str ###
        for i in range(9,len(df[x]),2):
            df[x].loc[i] = df[x].loc[i].str.extract('(\d*\.\d+|\d+)', expand=False).astype(float) 

    ### Extracting Date & type ###
    st=df[0].iloc[0,0]
    date = re.findall(r"\d{2}\s\w{3}\s\d{4}",st)
    dates=str(datetime.strptime(date[0],'%d %b %Y').date())
    s = df[0].iloc[1,3]
    types = (re.findall(r"\s\w*\s",s))[0].strip()

    ### airport data ###
    airport = df[0].iloc[1:4,:].copy()
    airport.drop(airport.iloc[:, 4:6], inplace = True, axis = 1) 
    header = airport.iloc[0]
    airport = airport.iloc[1:]
    airport.columns = header
    airport_name = airport.iloc[0,0]

    total_devices = {
        'num': int(airport['Total Devices'].iloc[0]),
        'active': int(airport['Total Devices'].iloc[1])
    }
    active_surveys = {
        'num': int(airport['Active Surveys'].iloc[0]),
        'completed': int(airport['Active Surveys'].iloc[1])
    }

    r = re.compile(".*Rank")
    rank_name = list(filter(r.match, airport.columns))[0] 
    rank = int(airport[rank_name].iloc[0])

    total_resp_till_date = int(airport['Total Responses Till Date'].iloc[0])

    exp_index_till_date = float(airport['Exp. Index Till Date'].iloc[0])

    avg_imp_index = float(airport['Improvement Index'].iloc[0])

    ### all_responses ###
    head = df[0].iloc[4,1:].dropna()
    allResponses = df[0].iloc[5:7,1:].dropna(axis = 1, how = 'all')
    allResponses.columns = head
    allResponses = allResponses.set_index(pd.Index(["resp_no","resp_pct"]))
    allResponses = allResponses.reset_index()
    allResponses.rename(columns={allResponses.columns[0]:'resp'},inplace=True)
    aresp = allResponses.to_dict('record')
    all_resp = cleanNull(aresp)
    
    ### general data input ###
    general = {
            'total_devices': total_devices,
            'active_surveys': active_surveys,
            'rank': rank,
            'total_resp_till_date': total_resp_till_date,
            'avg_exp_index': exp_index_till_date,
            'avg_imp_index': avg_imp_index,
            'all_responses': all_resp
        }

    ### data ###
    data = {
        'date': dates,
        'type': types,
        'general': general
    }

    for i in range(3):
        by_name = (df[i].iloc[7,0]).replace(" ","_").lower()
        bytype = df[i].iloc[8:].dropna(axis = 1, how = 'all')
        col_index = df[i].iloc[7,:].dropna()
        bytype.columns = col_index
        bytype.set_index(df[i].iloc[7,0],inplace = True)
        bytype.index = pd.Series(bytype.index).fillna(method='ffill')
#         byType = bytype.groupby(df[i].iloc[7,0]).agg(lambda x: list(x))
#         byType.columns = df[i].iloc[7,1:].dropna()
#         byType.reset_index(inplace=True)
#         byType.rename(columns={byType.columns[0]:'area'},inplace=True)
#         resp = byType.to_dict('record')
        bytype = bytype.reset_index()
        for x in range(1,len(bytype.index),2):
            bytype.iloc[x,0] = bytype.iloc[x,0] + "_pct"
        bytype.rename(columns={bytype.columns[0]:'area'},inplace=True)
        res = bytype.to_dict('record')
        resp = cleanNull(res)
        
        ### getting top and least areas ###
        air = df[i].iloc[1:4,:]
        header = air.iloc[0]
        air = air.iloc[1:]
        air.columns = header
        top_name = df[i].iloc[1,4]
    #         r = re.compile("Top\s.*")
    #         top_name = list(filter(r.match, air.columns))[0]  
        tnum = float(air[top_name].iloc[0])
        tarea = air[top_name].iloc[1]
        least_name = df[i].iloc[1,5]
    #         r = re.compile("Least")
    #         least_name = list(filter(r.match, air.columns))[0]  
        lnum = float(air[least_name].iloc[0])
        larea = air[least_name].iloc[1]
        top = {
            'exp': tnum,
            'area': tarea
        }
        least = {
            'exp': lnum,
            'area': larea
        }
        airport_name=df[0].iloc[2,0]
        by_type = {
            'top': top,
            'least': least,
            'responses': resp
        }
        data.update({by_name: by_type})
   
    
    ### Connection to database ###
    connect(airport_name,data)
#     print(data)

def cleanNull(data):
    cleanData = []
    for d in data:
        clean={}
        for k,v in d.items():
            if not(pd.isnull(v)):
                if isinstance(v,str):
                    if re.match('-*[0-9]+([.][0-9]+)?$',v):
                        v = float(v)
                if (k.find(".")!=-1):
                    k = k.replace(".","")
                clean[k] = v
            else:
                pass
        cleanData.append(clean)
    return cleanData


def connect(airport_name,data):
    URL = ("mongodb+srv://{}:{}@cluster0-qkpve.mongodb.net/test?retryWrites=true&w=majority").format(os.environ.get("user"),os.environ.get("pass"))
    cluster = MongoClient(URL)
    db = cluster["AirportDB"]
    collection = db[airport_name]
    collection.insert_one(data)

if __name__ == '__main__':
    app.run()