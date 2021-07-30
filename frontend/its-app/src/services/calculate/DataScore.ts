import { TotelScore } from './TotelScore'
import { FemaleFillter, MaleFillter } from '../fillter/GenderFillter'
import { BeforeAfterFillter, TimeTest } from '../fillter/TimeTesetFillter'
import { SkillTestFillter } from '../fillter/SkillTestFillter'

export const DataScore = (data: any, skill: any, AllData: boolean) => {
    let t =  TimeTest(data)
    // console.log("t",t)
    let BeforeAfterTest = BeforeAfterFillter(data)
    // console.log("BeforeAfterTest",BeforeAfterTest)
    let f = BeforeAfterFillter(FemaleFillter(data))
    let m = BeforeAfterFillter(MaleFillter(data))
    // console.log("TotelScore",TotelScore(BeforeAfterTest.First), skill)
    // SkillTestFillter(TotelScore(BeforeAfterTest.First), skill)   


    if (AllData) {
        return ({

            FirstN : SkillTestFillter(TotelScore(t.First), skill),
            SecondN : SkillTestFillter(TotelScore(t.Second), skill),
            FirstNCount : t.First.length,
            SecondNCount : t.Second.length,

            First : SkillTestFillter(TotelScore(BeforeAfterTest.First), skill),
            Second : SkillTestFillter(TotelScore(BeforeAfterTest.Second), skill),
            FirstCount : BeforeAfterTest.First.length,
            SecondCount : BeforeAfterTest.Second.length,

            FemaleFirst : SkillTestFillter(TotelScore(f.First), skill),
            FemaleSecond : SkillTestFillter(TotelScore(f.Second), skill),
            FemaleFirstCount : f.First.length,
            FemaleSecondCount : f.Second.length,

            MaleFirst : SkillTestFillter(TotelScore(m.First), skill),
            MaleSecond : SkillTestFillter(TotelScore(m.Second), skill),
            MaleFirstCount : m.First.length,
            MaleSecondCount : m.Second.length

        })
    }else{
        return({
            FirstNCount : t.First.length,
            SecondNCount : t.Second.length,
           
            First : SkillTestFillter(TotelScore(BeforeAfterTest.First), skill),
            Second : SkillTestFillter(TotelScore(BeforeAfterTest.Second), skill),
            FirstCount : BeforeAfterTest.First.length,
            SecondCount : BeforeAfterTest.Second.length,

            FemaleFirst : SkillTestFillter(TotelScore(f.First), skill),
            FemaleSecond : SkillTestFillter(TotelScore(f.Second), skill),
            FemaleFirstCount : f.First.length,
            FemaleSecondCount : f.Second.length,

            MaleFirst : SkillTestFillter(TotelScore(m.First), skill),
            MaleSecond : SkillTestFillter(TotelScore(m.Second), skill),
            MaleFirstCount : m.First.length,
            MaleSecondCount : m.Second.length

        })
    }

}

export const ScoreByUser = (data: any, skill: any) => {
    let t =  TimeTest(data)

        return ({

            First : SkillTestFillter(TotelScore(t.First), skill),
            Second : SkillTestFillter(TotelScore(t.Second), skill),
            
        })
    

}

