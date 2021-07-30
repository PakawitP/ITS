export const SkillTestFillter = (dataResults: any, dataSkill: any) => {

    let Skill: string[] = []
    let ResultsScore: number[] = []
   
    for (let i = 0; i < dataResults.length; i++) {
        if (dataResults[i].skill_id !== undefined) {
            for (let j = 0; i < dataSkill.length; j++) {
                if (dataResults[i].skill_id === dataSkill[j].skill_id) {
                    Skill.push(dataSkill[j].skill_name)
                    ResultsScore.push((dataResults[i].score / dataResults[dataResults.length - 1].user_count))
                    break
                }
            }
        }
    }


    return {
        Skill: Skill,
        ResultsScore: ResultsScore,
    }
}