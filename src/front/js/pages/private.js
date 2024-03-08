import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    return (
        <div className="text-center mt-5">
            {store.user && (
                <h1>Hola {store.user.email}</h1>
            )}
        </div>
    );
};
