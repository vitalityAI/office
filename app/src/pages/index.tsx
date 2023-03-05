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

const Home: NextPage<any> = ({ officers }) => {
  const { toastDispatch } = useToasts();
  const [input, setInput] = useState({
    phone: '',
  })
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

  return (
    <Layout>
      <div className="py-16 sm:py-24 ">
        {
          session ?
            <div className='w-fit bg-white bg-opacity-5 rounded-md p-4 text-center mx-auto'>
              <h1 className="text-white text-2xl font-extrabold">Hey {session.user.name.split(' ')[0]}!</h1>
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
            : null
        }


      </div>

    </Layout>
  );
};


export default Home;
