export const MaleFillter = (data: any) => {

    const Male = data.filter((DataFilter: any) => {
        return DataFilter.gender_id === 1
    })

    return Male


}

export const FemaleFillter = (data: any) => {

    const Female = data.filter((DataFilter: any) => {
        return DataFilter.gender_id === 2
    })

    return Female
}

// export const GenderFillter = (data:any) => {
    
//     return {
         
//     }
//     FemaleFillter(data)
//     MaleFillter(data)
// }
