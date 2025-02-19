export interface BubbleData{
    x: number;
    y: number;
    r: number;
}

export interface BubbleDataSet{
    label: string;
    data: BubbleData[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

export const BubbleRanges = {
    x:{min: 0, max: 50},
    y:{min: 0, max: 50},
    r:{min: 0, max: 50}
}

//blue scale
export const BubbleColors= [
    //blue scale only
    {backgroundColor: 'rgba(100, 162, 235, 0.6)', borderColor: 'rgba(100, 162, 235, 1)'},
    {backgroundColor: 'rgba(125, 162, 235, 0.6)', borderColor: 'rgba(125, 162, 235, 1)'},
    {backgroundColor: 'rgba(150, 162, 235, 0.6)', borderColor: 'rgba(150, 162, 235, 1)'},
    {backgroundColor: 'rgba(175, 162, 235, 0.6)', borderColor: 'rgba(175, 162, 235, 1)'},
    {backgroundColor: 'rgba(200, 162, 235, 0.6)', borderColor: 'rgba(200, 162, 235, 1)'},
    
]

