const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => {
        if (!res.ok) throw new Error("Unauthorized Access ⚠️");
        return res.json();
    });

export default fetcher;
