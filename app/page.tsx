'use client'
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/companies');
  return null;
}
