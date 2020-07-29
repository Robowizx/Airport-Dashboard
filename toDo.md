## Changes to VS-Code 
01: theme and looks changed
02: format document shortcut changed to shift+w

## To-Do list

01. Best and worst airport cards :
    - Add state level airports. [✅]
    - in column arengment. [✅] //To not perfect
    - Link to that airport page.
    - On hover highlight on map. //Possibely not now after presentation ( experimental idea )

02. To map :
    - check for letest map path.
    - default point's coloring in map also for devices ( facility's ) [ good, avg, bad ]. [✅]
        * added ranged coloring by exp { 0 < 50 < 70 < 100 }
        * added strokes to points. {0.3}
    - rendering optimizations.
    - dark theme addon.

03. Filters Tab : {✅}
    - add on check or click highlights.[✅]
        * insted of botton group used toggle button.
    - repaired the selection tab visuals.[✅]
        * removed variantt="outlined".

04. Layout page :
    - add placeholders.
    - try to make responsive page.[]
        * map responsive done.

05. Data fetching : {✅}
    - add loading screen. [✅]
        * added progress to loading screen.
    - sorting state and remove duplicates. [✅]
        * add to set and converted set to array.

06. Card Details :
    - Airport name [✅]
    - exp index for all airport [✅]
    - image

### Removed Code

01. -------------------------------------
/* 
 <ButtonGroup size="small" color="primary" aria-label="outlined primary button group" value={this.state.airType}>
<Button onClick={() => this.buttonClickState("All")}>All</Button>
<Button onClick={() => { return this.setState({ airType: "dom" }) }}>Domestic</Button>
 <Button onClick={() => { return this.setState({ airType: "int" }) }}>International</Button>
 </ButtonGroup> */