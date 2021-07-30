export const SkillFillter = (dataResults: any, dataSkill: any) => {
    let Skill: string[] = []
    let ResultsScore: number[] = []
    let Resultsmale: number[] = []
    let Resultsfemale: number[] = []
    let ResultsReturn: any = {}

    for (let i = 0; i < dataResults.length; i++) {
        for (let j = 0; i < dataSkill.length; j++) {
            if (dataResults[i].skill_id == dataSkill[j].skill_id) {
                Skill.push(dataSkill[j].skill_name)
                ResultsScore.push(dataResults[i].total_score)
                Resultsfemale.push(dataResults[i].total_score_female)
                Resultsmale.push(dataResults[i].total_score_male)
                break
            }
        }
    }
    ResultsReturn = {
        Skill: Skill,
        ResultsScore: ResultsScore,
        Resultsmale: Resultsmale,
        Resultsfemale: Resultsfemale
    }
    // console.log("ResultsReturn ",ResultsReturn )
    return ResultsReturn 
}