import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
   id: string,
   name: string,
   email: string,
   checkedInAt: string,
   createdAt: string | null
}

export function AttendeeList() {
   const [search, setSearch] = useState('')
   const [page, setPage] = useState(1)
   const [attendees, setAttendees] = useState<Attendee[]>([])

   useEffect(()=>{
      fetch('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
         .then(response => response.json())
         .then(data => {
            setAttendees(data.attendees)
         })
   },[page])

   const totalPages = Math.ceil(attendees.length/10)

   function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
      setSearch(event.target.value)
   }

   function goToFirstPage(){
      setPage(1)
   }

   function goToLastPage(){
      setPage(totalPages)
   }

   function goToPreviousPage(){
      setPage(page - 1)
   }

   function goToNextPage(){
      setPage(page + 1)
   }

   return (
      <div className="flex flex-col gap-4">
         <div className="flex gap-3 items-center">
            <h1 className="text-2xl font-bold">Participantes</h1>
            <div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg text-sm flex items-center gap-3">
               <Search className="size-4 text-emerald-300"/>
               <input onChange={onSearchInputChanged} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm" placeholder="Buscar participante..." />
            </div>
            {search}
         </div>

         <Table>
            <thead>
               <tr className="border-b border-white/10">
                  <TableHeader style={{width: 48}}>
                     <input type="checkbox" className="size-4 bg-black/20 border border-white/10 rounded" />
                  </TableHeader>
                  <TableHeader>Código</TableHeader>
                  <TableHeader>Participante</TableHeader>
                  <TableHeader>Data da inscrição</TableHeader>
                  <TableHeader>Data do check-in</TableHeader>
                  <TableHeader style={{width: 64}}></TableHeader>
               </tr>
            </thead>
            <tbody>
                  {attendees.map((attendee)=>{
                     return (
                        <TableRow key={attendee.id}>
                           <TableCell>
                              <input type="checkbox" className="size-4 bg-black/20 border border-white/10 rounded" />
                           </TableCell>
                           <TableCell>{attendee.id}</TableCell>
                           <TableCell>
                              <div className="flex flex-col gap-1">
                                 <span className="font-semibold text-white">{attendee.name}</span>
                                 <span>{attendee.email.toLowerCase()}</span>
                              </div>
                           </TableCell>
                           <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                           <TableCell>
                              {attendee.checkedInAt === null ? <span className="text-zinc-500">Não fez check-in</span> : dayjs().to(attendee.checkedInAt)}
                           </TableCell>
                           <TableCell>
                              <IconButton transparent>
                                 <MoreHorizontal className="size-4" />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     )
                  })}
            </tbody>
            <tfoot>
               <tr>
                  <TableCell colSpan={3}>
                     Mostrando 10 de {attendees.length} itens
                  </TableCell>
                  <TableCell className="text-right" colSpan={3}>
                     <div className="inline-flex gap-8 items-center">
                        <span>Página {page} de {totalPages}</span>
                        <div className="flex gap-1.5">
                           <IconButton onClick={goToFirstPage} disabled={page === 1}>
                              <ChevronsLeft className="size-4" />
                           </IconButton>
                           <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                              <ChevronLeft className="size-4" />
                           </IconButton>
                           <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                              <ChevronRight className="size-4" />
                           </IconButton>
                           <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                              <ChevronsRight className="size-4" />
                           </IconButton>
                        </div>
                     </div>
                  </TableCell>
               </tr>
            </tfoot>
         </Table>
      </div>
   )
}