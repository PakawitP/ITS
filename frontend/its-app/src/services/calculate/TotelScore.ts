export const TotelScore = (data: any) => {
    let score:any = [
        // { skill_id: 1, score: 0 },
        // { skill_id: 2, score: 0 },
        // { skill_id: 3, score: 0 },
        // { skill_id: 4, score: 0 },
        // { skill_id: 5, score: 0 },
        // { skill_id: 6, score: 0 },
        // { skill_id: 7, score: 0 },
        // { skill_id: 8, score: 0 },
        // {user_count:data.length},
    ]

    
    for (let i = 0; i < data.length; i++) {
        let temp = data[i].quiz_score
        for (let j = 0; j < temp.length; j++) {
  
            let TepmScore = score.findIndex((item : any) => {
                return item.skill_id === temp[j].skill_id
            })
            

            if (TepmScore === -1) {
                let NewSkill = {

                    skill_id: temp[j].skill_id, score: temp[j].score
                }
                score.push(NewSkill)
            } else {
                score[TepmScore].score += temp[j].score
            }
        }
    }

    score.push({user_count:data.length})
    return score
}



    