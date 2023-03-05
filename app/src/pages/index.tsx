import type { NextPage } from "next";
import { Layout } from "@/components/layout";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Header, { notify, ToastType } from "@/components/header";
import { Footer } from "@/components/footer";
import Background from "@/components/Background";
import React from "react";
import { handleInputChange } from "@/lib/handleInputChange";
import { InputField } from "@/components/InputField";
import OutlineButton from "@/components/OutlineButton";
import { useToasts } from "@/components/ToastProvider";
import { useSession } from 'next-auth/react'

const Session = ({ data, onClick = () => { }, ...props }) => {
  return (
    <div className="relative w-fit bg-white bg-opacity-5 p-6 m-2">
      <button className={`absolute right-2 top-1 w-fit text-pink transition-all ease-in-out`} onClick={onClick}>{"->"}</button>
      <p>Caller Phone: {data.callerPhone}</p>
      <p>Started At: {data.startedAt}</p>
    </div>
  );
}

const Home: NextPage<any> = ({ officers }) => {
  const { toastDispatch } = useToasts();
  const [input, setInput] = useState({
    phone: '',
  })
  const [sessions, setSessions] = useState([])
  const [focusSession, setFocusSession] = useState(null)

  const { data: session } = useSession()
  const submit = async () => {
    const operator = await fetch(process.env.NEXT_PUBLIC_API_URL + '/operator/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session['token'].sub}`
      },
      body: JSON.stringify({
        phone: input.phone
      })
    })

    notify(toastDispatch, "", "Updated Phone: " + input.phone, ToastType.SUCCESS)
  }

  const popOut = async (session) => {
    const messages = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/session/message/?sessionId=' + session.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })).json()

    const summary = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/session/summary/?sessionId=' + session.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })).json()

    session.messages = messages.messages;
    session.summary = summary.summary;
    console.log(session)

    setFocusSession(session)
  }

  const transfer = async () => {
    console.log(session['token'].sub)
    const res = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/session/transfer/?sessionId=' + focusSession.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session['token'].sub}`
      },
    })).json()
    await closePop()
  }

  const closePop = async () => {
    setFocusSession(null)
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetcher = async () => {
        const s = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/session?open=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })).json()

        setSessions(s.sessions)
      }
      await fetcher()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <div className="relative h-screen py-16 sm:py-24 px-4 sm:px-12 lg:px-24">
        {
          session ?
            <>
              {focusSession ?
                <div className="absolute w-fit z-10 text-white bg-black bg-opacity-80 p-8 rounded-sm left-0 right-0 mx-auto">
                  <button className={`absolute right-2 top-1 w-fit text-pink transition-all ease-in-out font-bold`} onClick={closePop}>{"X"}</button>
                  <div className="flex items-center ">
                    <h2 className="w-fit text-3xl font-extrabold">Caller: {focusSession.callerPhone} | {focusSession.startedAt}</h2>
                    <OutlineButton name="Transfer" onClick={transfer} className="ml-8" />
                  </div>
                  <p className="my-4 text-white"><span className="text-pink font-bold">Summary: </span>{focusSession.summary}</p>
                  {focusSession.messages.map(msg => {
                    return (
                      <div key={msg.id}>
                        <p className="text-white"><span className={`${msg.role == "USER" ? "text-green-300" : "text-blue-300"} font-bold`}>{msg.role}: </span>{msg.content}</p>
                        <p></p>
                      </div>
                    );
                  })}
                </div>
                : null
              }
              <div className={`${focusSession ? 'blur-sm' : 'blur-0'} transition-all`}>
                <div className='w-fit bg-white bg-opacity-5 rounded-md p-4 text-center mx-auto'>
                  <h2 className="text-white text-2xl font-extrabold">Hey {session.user.name.split(' ')[0]}!</h2>
                  <p className="text-white text-xl font-light mt-2"> Can you give us your number real quick?</p>

                  <div className='w-fit mt-4 mx-auto flex justify-start flex-wrap'>
                    <div className='w-72 mr-4'>
                      <InputField name="Phone Number" id="phone" value={input.phone} onChange={(e) => handleInputChange(e, input, setInput)} className="w-full" />
                    </div>
                    <div className='mt-4 flex items-center justify-center'>
                      <OutlineButton name="Register" onClick={submit} />
                    </div>
                  </div>
                </div>
                <div className="mt-16 text-white text-center p-4">
                  <h2 className="text-2xl font-extrabold">Active Calls</h2>
                  <div className="flex justify-center flex-wrap">
                    {sessions.map(session =>
                      <Session data={session} key={session.id} onClick={() => popOut(session)} />
                    )}
                  </div>
                </div>
              </div>

            </>
            : null
        }
      </div>
    </Layout>
  );
};


export default Home;
