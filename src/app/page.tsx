"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface PaginationObject {
  total_pages: number
  total_data: number
}

interface SPFObject {
  version: string
  mechanisms: string[]
}

interface DKIMObject {
  version: string
  algorithm: string
  public_key: string
}

interface DMARCObject {
  version: string
  policy: string
}

interface DomainObject {
  domain_name: string
  spf_results?: SPFObject[]
  dkim_results?: DKIMObject[]
  dmarc_results?: DMARCObject[]
}

interface DataObject {
  pagination: PaginationObject
  results: DomainObject[]
}

interface DatasetResponseType {
  data: DataObject
  message: string
}


export default function Home() {

  const [data, setData] = useState<DatasetResponseType | undefined>()
  const [page, setPage] = useState<number>(1)
  const totalPages = data?.data.pagination.total_pages ?? 1
  const [loading, setLoading] = useState<boolean>(true)

  async function fetchDomains() {
    setLoading(true)
    const response = await fetch(`http://localhost:8000/check-dataset?page=${page}`)

    if (response.ok) {
      const json = await response.json() as DatasetResponseType
      setData(json)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDomains()
  }, [])


  useEffect(() => {
    fetchDomains()
  }, [[page]])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {loading && <div>Loading data....</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Domain Name</TableHead>
              <TableHead>SPF Version</TableHead>
              <TableHead>SPF Mechanisms</TableHead>
              <TableHead>DKIM Version</TableHead>
              <TableHead>DKIM Algorithm</TableHead>
              <TableHead>DKIM Public Key</TableHead>
              <TableHead>DMARC Version</TableHead>
              <TableHead>DMARC Policy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(loading ? ([] as DomainObject[]) : data?.data?.results ?? ([] as DomainObject[])).map((domain, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="">{domain.domain_name}</TableCell>
                  <TableCell className="">{domain.spf_results ? domain.spf_results[0].version : "-"}</TableCell>
                  <TableCell className="">{domain.spf_results ? domain.spf_results[0].mechanisms.join(", ") : "-"}</TableCell>
                  <TableCell className="">{domain.dkim_results ? domain.dkim_results[0].version : "-"}</TableCell>
                  <TableCell className="">{domain.dkim_results ? domain.dkim_results[0].algorithm : "-"}</TableCell>
                  <TableCell className="">{domain.dkim_results ? domain.dkim_results[0].public_key.slice(0,10) : "-"}</TableCell>
                  <TableCell className="">{domain.dmarc_results ? domain.dmarc_results[0].version : "-"}</TableCell>
                  <TableCell className="">{domain.dmarc_results ? domain.dmarc_results[0].policy : "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            {((page - 1) > 0) && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => {
                    if (!loading) {
                      setPage(page-1)
                    }
                  }} 
                  href="#"
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            {((page + 1) < totalPages) && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => {
                    if (!loading) {
                      setPage(page+1)
                    }
                  }} 
                  href="#"
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </main>
    </div>
  );
}
