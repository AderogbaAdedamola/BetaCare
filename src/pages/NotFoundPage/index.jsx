import { Link } from "react-router-dom"

export default function NotFoundPage (){
    return(
        <div className="w-[100%] h-[100%] flex item-center justify-center text-16">
            <p>The Page you are looking for those not exixt </p>
            <div className="text-8 text-green">
                <Link to ="/">
                Go Home
                </Link>
            </div>
        </div>
    )
}