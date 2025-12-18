import { HOST } from "../../../data/host.js";

export class Entreprises {



    async createSiren(dep) {
        console.log("[services] > create siren")
        try {
            const preRes = await fetch(`${HOST}/api/entreprises/siren`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    dep: dep
                }),
            });
            const res = await preRes.json();
            return res;
        } catch (err) {
            console.error(err);
        }
    }


}