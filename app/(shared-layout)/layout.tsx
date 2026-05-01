import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayout({children} : {children : ReactNode}){
    return (
        <>
        <Navbar/>
        {children}
        </>
    )
}