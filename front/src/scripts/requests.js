

export async function getServices(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const storage = await res.json();
        // console.log(storage);
        
        return storage; // Возвращаем данные из функции
    } catch (err) {
        console.log(err.message);
        return [];
    }
}