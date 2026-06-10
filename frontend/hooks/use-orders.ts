"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrder, type Order } from "@/lib/api";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}

export function useOrder(id: number) {
  return useQuery<Order>({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}
