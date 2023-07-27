export const Lerp = (start, end, amt)=> {
    return (1-amt)*start+amt*end;
}

export const CopyValueWithoutReference = (Data) => {
    return JSON.parse(JSON.stringify(Data));
}

export const Sleep = (Time) => new Promise((r)=> setTimeout(r, Time));