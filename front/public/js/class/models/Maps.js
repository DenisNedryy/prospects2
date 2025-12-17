export class Maps {


    getCentroid(pointsStr) {
        const nums = pointsStr
            .trim()
            .split(/[ ,]+/)
            .map(n => parseFloat(n));

        let xSum = 0;
        let ySum = 0;
        let count = 0;

        for (let i = 0; i < nums.length; i += 2) {
            xSum += nums[i];
            ySum += nums[i + 1];
            count++;
        }

        return {
            x: xSum / count,
            y: ySum / count
        };
    }
}