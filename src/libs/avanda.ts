import {Graph} from "@avanda/avandajs"
let userToken = localStorage.getItem("user-token")


Graph.setRequestConfig({
    baseURL: "http://192.168.18.3:4000/",
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${userToken}`
    }
})

export default Graph