import type { NextPage } from "next";
import { Layout } from "@/components/layout";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Header, { notify, ToastType } from "@/components/header";
import { Footer } from "@/components/footer";
import React from "react";
import { handleInputChange } from "@/lib/handleInputChange";
import { InputField } from "@/components/InputField";
import OutlineButton from "@/components/OutlineButton";
import { useToasts } from "@/components/ToastProvider";
import { useSession } from 'next-auth/react'
import Background from '@/components/Background';
import SiteLink from "@/components/SiteLink";

const Session = ({ data, onClick = () => { }, ...props }) => {
  return (
    <div className="relative w-fit bg-white bg-opacity-5 p-6 m-2">
      <button className={`absolute right-2 top-1 w-fit text-blue transition-all ease-in-out`} onClick={onClick}>{"->"}</button>
      <p>Caller Phone: {data.callerPhone}</p>
      <p>Started At: {data.startedAt}</p>
    </div>
  );
}

const Demo: NextPage<any> = ({ officers }) => {
  const updateDelay = 2000
  const { toastDispatch } = useToasts();
  const [input, setInput] = useState({
    phone: '',
  })
  const focusSessionMsgInterval = useRef(null);
  const [sessions, setSessions] = useState([])
  const [loadingSummary, setLoadingSummary] = useState(false)
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

  const getSummary = async (sesh) => {
    const summary = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/session/summary/?sessionId=' + sesh.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })).json()
    return summary.summary
  }

  const summarize = async () => {
    // setLoadingSummary(true)
    notify(toastDispatch, "", "Loading summary...", ToastType.DEFAULT)
    focusSession.summary = await getSummary(focusSession)
    notify(toastDispatch, "", "Loaded summary!", ToastType.SUCCESS)
    setFocusSession(focusSession)
    // setLoadingSummary(false)
  }

  const updateMessages = async (sesh) => {
    const messages = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/session/message/?sessionId=' + sesh.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })).json()

    return messages.messages
  }

  const popOut = async (sesh) => {
    setFocusSession(sesh)
  }

  const transfer = async () => {
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
    clearInterval(focusSessionMsgInterval.current);
    setFocusSession(null)
  }

  useEffect(() => {
    const main = async () => {
      const fetcher = async () => {
        focusSession.messages = await updateMessages(focusSession)
        setFocusSession(focusSession)
      }
      if (focusSession) {
        if (!focusSession.messages) {
          await fetcher();
          focusSessionMsgInterval.current = setInterval(fetcher, updateDelay)
        }
      }
    }
    main()
  }, [focusSession])

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
    }, updateDelay)

    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <Header />
      <div className='relative w-full m-0 h-screen'>
        <Background className="" />
        <main className='relative w-full min-h-screen bg-transparent'>
          <div className="relative h-screen py-16 sm:py-24 px-4 sm:px-12 lg:px-24">
            {
              session ?
                <>
                  <div className={`absolute  ${focusSession ? "backdrop-blur-sm translate-y-0 opacity-100" : " backdrop-blur-0 translate-y-20 opacity-0"} transition-all w-fit max-w-5xl z-50 text-white bg-black bg-opacity-80 p-8 rounded-sm left-0 right-0 mx-auto`}>
                    <button className={`absolute right-2 top-1 w-fit text-blue transition-all ease-in-out font-bold`} onClick={closePop}>{"X"}</button>
                    {focusSession ?
                      <><div className="flex items-center ">
                        <h2 className="w-fit text-2xl font-extrabold">Caller: {focusSession.callerPhone} | {focusSession.startedAt}</h2>
                        <OutlineButton name="Summarize" onClick={summarize} className="ml-8" />
                        <OutlineButton name="Transfer" onClick={transfer} className="ml-8" />
                      </div>
                        <p className="my-4 text-white"><span className="text-blue font-bold">Summary: </span>{focusSession.summary}</p>
                        <div className="">
                          {(focusSession.messages ? focusSession.messages : []).map(msg => {
                            return (
                              <div key={msg.id}>
                                <p className="text-white"><span className={`${msg.role == "USER" ? "text-green-300" : "text-blue-300"} font-bold`}>{msg.role}: </span>{msg.content}</p>
                                <p></p>
                              </div>
                            );
                          })}
                        </div>
                      </>
                      : null
                    }
                  </div>

                  <div className={`transition-all`}>
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
                      <p className="font-light mt-2">Due to usage restrictions, please contact either <SiteLink href={"https://arulandu.com"} txt="Alvan Caleb Arulandu" /> {' or '} <SiteLink href={"https://crucialnet.org"} txt="Rushil Umaretiya" /> for the hotline number!</p>

                      <div className="mt-6 flex justify-center flex-wrap">
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
          <Footer />
        </main>
      </div >

    </Layout >
  );
};


export default Demo;
