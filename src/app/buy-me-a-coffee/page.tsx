'use client';

export default function FAQPage() {
  return (
    <div className="bg-slate-950 flex flex-col items-center justify-center min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-raleway tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Kya bhai tere se paise thori lun ga 😊?</span>
                <span className="block text-[#0FAE96] mt-2">Pr phir bhi maan hai to kr de 😜</span>
            </h1>
            <div className="my-10 h-70 w-full flex items-center justify-center">
                <img 
                    className="rounded-3xl mx-auto max-w-70 w-full h-full object-contain" 
                    src="/GooglePay_QR.png" 
                    alt="google pay qr"
                />
            </div>
        </div>
    </div>
    </div>

  );
}