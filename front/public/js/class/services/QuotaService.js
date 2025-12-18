import { HOST } from "../../../data/host.js";

export class QuotaService {


    async getPappersQuota() {
        try {
            const preRes = await fetch(`${HOST}/api/quotas/pappers`, {
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

    async getDropContactQuota() {
        try {
            const preRes = await fetch(`${HOST}/api/quotas/dropContact`, {
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
}

