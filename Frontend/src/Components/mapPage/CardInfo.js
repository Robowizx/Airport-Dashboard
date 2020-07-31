import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

export default function CardInfo(props) {
  let useStyles = makeStyles({
    root: {
      width: Number(props.width),
      height: Number(props.height),
      cn: props.cname,
    },
  });
  let classes = useStyles();
  return (
    <div className={props.cn}>
      <Card className={classes.root}>
        <CardContent>{props.children}</CardContent>
      </Card>
    </div>
  );
}
