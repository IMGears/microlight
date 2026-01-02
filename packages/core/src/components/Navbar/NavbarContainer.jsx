import Navbar from './Navbar';

export default function NavbarContainer({children}){
  return (
    <>
      <Navbar />
      <main className="pt-10 flex">
        <div className="flex-1 px-2 sm:px-3 pt-1 pb-0 min-w-0">
          {children}
        </div>
      </main>
    </>
  )
}