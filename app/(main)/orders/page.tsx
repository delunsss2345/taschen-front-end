'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ArrowUpRight, ChevronRight, Globe, Package, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const orders = [
  {
    id: 'WEB-9847562',
    date: 'Dec 12, 2024',
    total: '$127.97',
    status: 'In Transit' as const,
    arrival: 'Arriving Dec 18-20',
    arrivalSub: 'Your package is on its way',
    items: [
      {
        name: 'The Great Gatsby',
        variant: 'Hardcover · English',
        price: '$49.99',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Atomic Habits',
        variant: 'Paperback · English',
        price: '$59.99',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Dune: Deluxe Edition',
        variant: 'Hardcover · Illustrated',
        price: '$17.99',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'WEB-7623891',
    date: 'Nov 28, 2024',
    total: '$84.50',
    status: 'Delivered' as const,
    arrival: 'Delivered Dec 2',
    arrivalSub: 'Left at front door',
    items: [
      {
        name: '1984 – George Orwell',
        variant: 'Paperback · English',
        price: '$12.50',
        image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Clean Code',
        variant: 'Paperback · English',
        price: '$42.00',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'The Alchemist',
        variant: 'Paperback · English',
        price: '$30.00',
        image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
]

const tabs = ['All Orders', 'In Progress', 'Delivered', 'Returns'] as const

export default function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState<string>('All Orders')

  return (
    <main className='min-h-[calc(100vh-80px)] bg-white'>
      <div className='container-main py-10'>
        {/* Heading */}
        <h1 className='text-3xl font-bold tracking-tight'>Your Orders</h1>
        <p className='mt-1 text-sm text-neutral-500'>
          Track, return, or buy items again
        </p>

        {/* Tabs + Search */}
        <div className='mt-8 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex gap-1'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${activeTab === tab
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />
            <Input
              placeholder='Search orders...'
              className='h-9 w-56 rounded-lg border-neutral-200 pl-9 text-sm'
            />
          </div>
        </div>

        {/* Order cards */}
        <div className='mt-8 space-y-8'>
          {orders.map((order) => (
            <div
              key={order.id}
              className='overflow-hidden rounded-xl border border-neutral-200'
            >
              {/* Order header */}
              <div className='flex flex-wrap items-center justify-between gap-y-2 border-b border-neutral-100 bg-neutral-50/60 px-6 py-4'>
                <div className='flex flex-wrap gap-x-10 gap-y-1 text-sm'>
                  <div>
                    <p className='text-xs text-neutral-400'>Order placed</p>
                    <p className='font-medium'>{order.date}</p>
                  </div>
                  <div>
                    <p className='text-xs text-neutral-400'>Order number</p>
                    <p className='font-medium'>{order.id}</p>
                  </div>
                  <div>
                    <p className='text-xs text-neutral-400'>Total</p>
                    <p className='font-medium'>{order.total}</p>
                  </div>
                </div>
                <Badge
                  variant='outline'
                  className={`gap-1.5 rounded-full border-0 px-3 py-1 text-xs font-medium ${order.status === 'Delivered'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-blue-50 text-blue-700'
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${order.status === 'Delivered'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                      }`}
                  />
                  {order.status}
                </Badge>
              </div>

              {/* Delivery status */}
              <div className='flex items-center justify-between px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100'>
                    <Package className='h-4 w-4 text-neutral-600' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{order.arrival}</p>
                    <p className='text-xs text-neutral-400'>
                      {order.arrivalSub}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-1 rounded-lg text-xs'
                >
                  Track <ArrowUpRight className='h-3 w-3' />
                </Button>
              </div>

              <Separator />

              <div className='divide-y divide-neutral-100'>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className='flex items-start gap-4 px-6 py-5'
                  >
                    <div className='relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    </div>

                    <div className='flex-1'>
                      <p className='text-sm font-medium text-neutral-900'>
                        {item.name}
                      </p>
                      <p className='mt-0.5 text-xs text-neutral-400'>
                        {item.variant}
                      </p>
                      <button className='mt-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50'>
                        <Globe className='h-3 w-3' />
                        Track Item
                      </button>
                    </div>

                    <p className='text-sm font-semibold text-neutral-900'>
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className='flex items-center justify-between border-t border-neutral-100 px-6 py-3'>
                <button className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline'>
                  View order details <ChevronRight className='h-3.5 w-3.5' />
                </button>
                <button className='text-sm font-medium text-neutral-500 hover:text-neutral-900'>
                  Need Help?
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}