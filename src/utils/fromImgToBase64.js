function filesToBase64(files) {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(files[i]);
        });

        promises.push(promise);
    }

    return Promise.all(promises);
}
export default filesToBase64;