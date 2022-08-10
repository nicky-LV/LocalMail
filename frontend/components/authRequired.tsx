import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

export default function AuthRequired(props: any){
    const [auth, setAuth] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        try {
            if ((Cookies.get('uuid') && Cookies.get('access_token') && Cookies.get('refresh_token'))){
                setAuth(true);
            }

            else {
                router.replace('/login')
            }
        }

        catch (e) {

        }
    })

    return <section>
        {auth && React.cloneElement(props.children, {
            uuid: Cookies.get('uuid'),
            accessToken: Cookies.get('access_token'),
            refreshToken: Cookies.get('refresh_token')
        })}
    </section>
}