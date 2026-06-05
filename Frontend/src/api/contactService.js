import api from "./apiManager";

export const submitContact = (data) => 
    api.post("/contact", data);


export const getAllContacts = () => 
    api.get("/contact/admin");


export const markContactRead = (id) => 
    api.patch(`/contact/admin/${id}/read`);