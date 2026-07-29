import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [activeBacklogs, setActiveBacklogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const subjSnap = await getDocs(query(collection(db, 'subjects'), orderBy('order')));
        const subjs = subjSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setSubjects(subjs);

        const chapSnap = await getDocs(query(collection(db, 'chapters'), orderBy('order')));
        const chaps = chapSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setChapters(chaps);
      } catch (err) {
        console.error("Error fetching static data, perhaps empty database", err);
      }
    };

    fetchStaticData();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
      setActiveBacklogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribeUser = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData({ id: docSnap.id, ...docSnap.data() });
      }
    });

    const backlogsRef = collection(db, `backlogs/${currentUser.uid}/items`);
    const q = query(backlogsRef, where("status", "==", "active"));
    
    const unsubscribeBacklogs = onSnapshot(q, (querySnapshot) => {
      const backlogs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setActiveBacklogs(backlogs);
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribeBacklogs();
    };
  }, [currentUser]);

  const value = {
    userData,
    subjects,
    chapters,
    activeBacklogs,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
