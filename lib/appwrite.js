import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";
export const Config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm_Aora",
  projectId: "66a62cfd002ca5db76fe",
  databaseId: "66a62f9800239e260054",
  userCollectionId: "66a62ff500041ff1b567",
  videoCollectionId: "66a6301400275806c48e",
  storageId: "66a6325800128753b1ff",
};

const client = new Client();

client
  .setEndpoint(Config.endpoint)
  .setProject(Config.projectId)
  .setPlatform(Config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      Config.databaseId,
      Config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
// Sign In

export async function signIn(email, password) {
  try {
    // const session = await account.createEmailSession(email, password);
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};
