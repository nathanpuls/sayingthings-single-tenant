import { db } from "../src/lib/firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function testRead() {
    const collections = ["demos", "videos", "studio", "clients", "reviews"];
    console.log("Checking collections...", collections);

    for (const col of collections) {
        try {
            const snapshot = await getDocs(collection(db, col));
            console.log(`${col}: ${snapshot.size} documents found.`);
            if (snapshot.size > 0) {
                snapshot.forEach(doc => {
                    // console.log(`  - ${doc.id}`);
                });
            }
        } catch (error) {
            console.error(`Error reading ${col}:`, error.message);
        }
    }
    process.exit(0);
}

testRead();
