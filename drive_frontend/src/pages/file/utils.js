async function deriveKey(password, salt = null) {
    if (!salt) {
        salt = window.crypto.getRandomValues(new Uint8Array(16));
    }

    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(password);

    const baseKey = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        baseKey,
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );

    return { key, salt };
}
export async function encryptFile(file, password) {
    const { key, salt } = await deriveKey(password);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const fileData = await file.arrayBuffer();
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        fileData
    );

    const combinedData = new Uint8Array([
        ...salt,
        ...iv,
        ...new Uint8Array(encryptedData)
    ]);

    return {
        data: combinedData,
        filename: file.name
    };
}

export async function decryptFile(encryptedData, password) {
    const dataView = encryptedData;

    const salt = dataView.slice(0, 16);
    const iv = dataView.slice(16, 28);
    const encryptedFileContent = dataView.slice(28);

    const { key } = await deriveKey(password, salt);
    console.log("salt ", salt)
    console.log("iv ", iv)
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedFileContent
    );

    return {
        data: decryptedData,
        filename: 'hello.pdf',
        cryptoKey: key
    };
}

export function downloadFile(data, filename) {
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const formatDate = (date) => {
    const uploadDate = new Date(date); // Convert to Date object
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour format
        // timeZone: 'Asia/Kolkata' // Set to IST
    };
    const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(uploadDate);
    return formattedDate
}
export const allowedFileTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'video/quicktime',
    'video/mp4',
]

// Convert CryptoKey to sharable format
export async function extractShareableKey(cryptoKey) {
    if (!cryptoKey)
        return "";
    const exportedKey = await window.crypto.subtle.exportKey(
        "raw",
        cryptoKey
    );
    return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

// Reconstruct CryptoKey from shared format
async function reconstructKey(keyString) {
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));

    return await window.crypto.subtle.importKey(
        "raw",
        keyData,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    );
}

// Modified decryptFile to work with shared key
export async function decryptFileWithSharedKey(encryptedData, sharedKey) {
    try {
        if (!sharedKey) {
            return {
                error: "Please use full link"
            }
        }
        const dataView = encryptedData;
        const iv = dataView.slice(16, 28);
        const encryptedFileContent = dataView.slice(28);

        const key = await reconstructKey(sharedKey);

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encryptedFileContent
        );

        return {
            data: decryptedData,
            filename: 'hello.pdf'
        };
    } catch (err) {
        return {
            error: "Please use full link"
        }
    }
}