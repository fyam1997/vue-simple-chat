import {authorizeDrive, loadGoogleAuth, logoutToken} from "./google_auth.ts";
import {createDriveTextFile, getDriveFile, getDriveFileID, updateDriveTextFile} from "./google_drive_api.ts";

export async function getSimpleDriveFile(clientID: string, fileName: string): Promise<string> {
    await loadGoogleAuth()
    const token = await authorizeDrive('https://www.googleapis.com/auth/drive.appdata', clientID)
    try {
        const id = await getDriveFileID(token, `name='${fileName}'`)
        return await getDriveFile(id, token)
    } catch (error) {
        console.error(error)
        return undefined
    } finally {
        await logoutToken(token)
    }
}

export async function setSimpleDriveFile(clientID: string, fileName: string, content: string): Promise<void> {
    await loadGoogleAuth()
    const token = await authorizeDrive('https://www.googleapis.com/auth/drive.appdata', clientID)
    try {
        const id = await getDriveFileID(token, `name='${fileName}'`)
        if (id) {
            await updateDriveTextFile({
                id: id,
                name: fileName,
                content: content,
                token: token
            })
        } else {
            await createDriveTextFile({
                name: fileName,
                content: content,
                token: token
            })
        }
    } catch (error) {
        console.error(error)
    } finally {
        await logoutToken(token)
    }
}
