import {FirstTimeFillter} from './TimeTesetFillter'

export const Province = (ProvinceSchool: any, DataScore: any) => {
    let data: any = []
    // console.log(DataScore)
    for (let i = 0; i < ProvinceSchool.length; i++) {
        const result = DataScore.filter((item: any) => {
            return item.school_id === ProvinceSchool[i].school_id
        })
        data = [...data, ...result]
    }

    // console.log(data)
    return data
}

export const School = (School: number, DataScore: any) => {
  
    const result = DataScore.filter((item: any) => {
        return item.school_id === School
    })

    return result
}

export const UserBySchool = (Data:any,School:number) => {
    let FirstTime = FirstTimeFillter(Data)
    const result = FirstTime.filter((item: any) => {
        return item.school_id == School
    })

    console.log(result)
    return result
}