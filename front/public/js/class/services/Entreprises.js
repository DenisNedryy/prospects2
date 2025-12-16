import { HOST } from "../../../data/host.js";

export class Entreprises {


    async getSirenDepLength() {
        try {
            const preRes = await fetch(`${HOST}/api/entreprises/sirenDepLength`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
            });
            const res = await preRes.json();
            return res;
        } catch (err) {
            console.error(err);
        }
    }


    async getSirenPerDep(dep) {
        try {
            const preRes = await fetch(`${HOST}/api/entreprises/siren/${dep}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
            });
            const res = await preRes.json();
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    async createSiren(dep) {
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

    async getAllentreprisesData(page = 1) {
        try {
            const preRes = await fetch(`${HOST}/api/entreprises?page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
            });
            const res = await preRes.json();
            return res;
        } catch (err) {
            console.error(err);
        }
    }


    async getentreprisesByDep(dep, page = 1) {
        try {
            const preRes = await fetch(`${HOST}/api/entreprises/dep/${dep}?page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include",
            });
            const res = await preRes.json();
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    async getentreprisesByQuery(query, page = 1) {
        try {
            const preRes = await fetch(`${HOST}/api/entreprises/query/${query}?page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
            });
            const res = await preRes.json();
            return res;
        } catch (err) {
            console.error(err);
        }
    }

}