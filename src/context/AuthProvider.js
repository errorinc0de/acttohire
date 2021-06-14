import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function register(email, password,name,college,rollno,universityRoll,gradDate,sex,collegeUid) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        const user = auth.currentUser;
        user.updateProfile({
          displayName: name,
        }).then((result)=>{
          db.collection("users").doc(user.uid).set({
            displayName:name,
            uid:user.uid,
            email,
            college,
            rollno,
            universityRoll,
            gradDate,
            sex,
            isHired: false,
            visitedBy:[],
            offers: [],
            isStudent:true,
            collegeUid,
            visitedBy:[],
            topics:{},
            awards:{}
          }).then(()=>{
            resolve()
          })
          .catch(error => reject("error creating profile"));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    })
  }

// user login
function login(email, password) {
    return new Promise((resolve, reject) => {
      db.collection("users").where("email","==",email).onSnapshot((docs)=>{
        if(!docs.empty)
        {
          docs.forEach(doc=>{
            if(doc.exists)
            {
                if(doc.data().isCollege === undefined && doc.data().isHr === undefined) 
                {
                  auth.signInWithEmailAndPassword(email, password).then(() => {
                    resolve()
                  })
                  .catch(error => reject(error));
                }
                else
                {
                  reject({message:"Not registered as an user"})
                }
            }
            else
            {
              reject({message:"no such account exists"})
            }
            })
        }
        else
        {
          reject({message:"no such account exists"})
        }
      })
    })
  }


  function hrRegister(email, password,name,company,country,state,contact) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        const user = auth.currentUser;
        user.updateProfile({
          displayName: name,
        }).then((result)=>{
          db.collection("users").doc(user.uid).set({
            displayName:name,
            uid:user.uid,
            email,
            company,
            country,
            state,
            contact,
            studentData:[],
            isHr:true,
            quota:0
          }).then(()=>{
            resolve()
          })
          .catch(error => reject("error creating profile"));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    })
  }
  function  College_registration(name_clg,email, password,contact,clg_address,extras) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        const user = auth.currentUser;
        user.updateProfile({
          displayName: name_clg,
        }).then((result)=>{
          db.collection("users").doc(user.uid).set({
            displayName:name_clg,
            uid:user.uid,
            email,
            contact,
            clg_address,
            extras,
            isCollege:true,
          }).then(()=>{
        
            resolve()

          })
          .catch(error => reject("error creating profile"));
        })
        .catch(error => reject(error));
      })
      .catch(error => reject(error));
    })
  }

// college login
function collegeLogin(email, password) {
  return new Promise((resolve, reject) => {
    db.collection("users").where("email","==",email).onSnapshot((docs)=>{
      if(!docs.empty)
      {
        docs.forEach(doc=>{
          if(doc.exists)
          {
              if(doc.data().isStudent === undefined && doc.data().isHr === undefined) 
              {
                auth.signInWithEmailAndPassword(email, password).then(() => {
                  resolve()
                })
                .catch(error => reject(error));
              }
              else
              {
                reject({message:"Not registered as an user"})
              }
          }
          else
          {
            reject({message:"no such account exists"})
          }
          })
      }
      else
      {
        reject({message:"no such account exists"})
      }
    })
  })
}

// HR login
function hrLogin(email, password) {
  return new Promise((resolve, reject) => {
    db.collection("users").where("email","==",email).onSnapshot((docs)=>{
      if(!docs.empty)
      {
        docs.forEach(doc=>{
          if(doc.exists)
          {
              if(doc.data().isCollege === undefined && doc.data().isStudent === undefined) 
              {
                auth.signInWithEmailAndPassword(email, password).then(() => {
                  resolve()
                })
                .catch(error => reject(error));
              }
              else
              {
                reject({message:"Not registered as an user"})
              }
          }
          else
          {
            reject({message:"no such account exists"})
          }
          })
      }
      else
      {
        reject({message:"no such account exists"})
      }
    })
  })
}
  function logout() {
    setCurrentUser()
    return auth.signOut()
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user && user.uid)
      {
        var unsubscribe = db.collection("users").doc(user.uid).onSnapshot((docs)=>{
          if(!docs.empty)
            {
              setCurrentUser(docs.data())
              setLoading(false)
            }
          })
      }else
        setLoading(false)

      return unsubscribe
      
    })

    return unsubscribe
  }, [])



  const value = {
    login,
    logout,
    updateEmail,
    register,
    hrRegister,
    College_registration,
    collegeLogin,
    hrLogin,
    currentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}



