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

const PageButton = ({ name = "", link, target="_self", className = "" }) => {
  return (
    <a href={link} target={target} className={`mt-8 group p-2 border-solid border bg-white bg-opacity-0 hover:bg-opacity-5 border-white transition-all ${className}`}>{name} <span className="ml-0 group-hover:ml-1 transition-all">{"->"}</span></a>
  );
}

const Home: NextPage<any> = ({ officers }) => {
  return (
    <Layout>
      <div className='relative w-full m-0 h-screen'>
        <Background className="" />
        <main className='relative w-full h-screen bg-transparent text-white '>
          <div className="px-8 flex flex-col justify-center items-center ">
            <div className="mt-[25vh] sm:mt-[33vh] max-w-xl">
              <h1 className="text-6xl font-extrabold">vi·tal·i·ty</h1>
              <h2 className="text-xl font-light">[vī'talədē]&nbsp;&nbsp;<i>noun</i></h2>
              <ul className="ml-6 list-decimal">
                <li>The state of being strong and active; energy. The power giving continuance of life, present in all living things.</li>
                <li>A next-gen platform connnecting callers in crisis to an AI-powered chatbot for compassionate and responsive support.</li>
              </ul>
              <div className="flex ml-6">
                <PageButton name="Demo" link="/demo" />
                <PageButton name="Devpost" link="https://devpost.com/software/vitality-q7sbh8" className="ml-4" target="_blank" />
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
};


export default Home;
