export const FirstTimeFillter = (data: any) => {
    
    const TimeTest_1 = data.filter((DataFilter: any) => {
        return DataFilter.times_test === 1
    })

    return TimeTest_1
}

export const SecondTimeFillter = (data: any) => {

    const TimeTest_2 = data.filter((DataFilter: any) => {
        return DataFilter.times_test === 2
    })
    // console.log("TimeTest_2",TimeTest_2)
    return TimeTest_2
}

export const TimeTest = (data: any) => {
    return ({
        First: FirstTimeFillter(data),
        Second: SecondTimeFillter(data)
    })
}


export const BeforeAfterFillter = (data: any) => {
    let indexTemp = []
    let findTemp

    // console.log("data",data)
    const te = SecondTimeFillter(data)
    // console.log("SecondTimeFillter",te.length)
    const ta = FirstTimeFillter(data)
    // console.log("FirstTimeFillter",ta.length)
    const tb = ta

    for (let i = 0; i < ta.length; i++) {
        findTemp = te.findIndex((item: any) => {
            return item.user_id === ta[i].user_id
        })
        if (findTemp === -1) {
            indexTemp.push(i)
        }
    }
    console.log("indexTemp",indexTemp)

    if (indexTemp.length > 0) {
        for (let j = indexTemp.length - 1; j >= 0; j--) {
            console.log(indexTemp[j])
            tb.splice(indexTemp[j], 1)
        }
    }
    
    return ({
        First: tb,
        Second: te
    })

}