import axios from "axios";

export const delQuizset = async(id: number,api:string) => {
    let t:boolean = false
    await axios.post(api, {
        "del_id": id,
    }, {
        headers: {
            Authorization: `${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
    })
        .then(response => {
            // console.log("response",response)
            if (response.data.msg === true) {
                t = true
            }
            else {
                t = false
            }

            return response.data;
        })
    return t
}