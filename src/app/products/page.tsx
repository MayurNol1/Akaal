import Link from "next/link";
import { Filter, ShoppingBag } from "lucide-react";
import { Prisma, Product } from "@prisma/client";
import prisma from "@/lib/prisma";
import { SortSelect } from "./sort-select";
import { Pagination } from "./pagination";
import { ProductCardStitch } from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export default async function ProductListingPage(props: {
  searchParams?: Promise<{ query?: string; category?: string; sort?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const categoryId = searchParams?.category || "";
  const sort = searchParams?.sort || "relevance";
  const page = Number(searchParams?.page) || 1;
  const limit = 9; // Display 9 products per page

  const skip = (page - 1) * limit;

  let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = undefined;
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const totalProducts = await prisma.product.count({
    where: { 
      isActive: true,
      ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {})
    }
  });

  const totalPages = Math.ceil(totalProducts / limit);

  const products = await prisma.product.findMany({
    where: { 
      isActive: true,
      ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {})
    },
    orderBy,
    skip,
    take: limit
  });
  const categoriesDb = await prisma.category.findMany({
    include: {
      _count: {
        select: { 
          products: {
            where: { isActive: true }
          }
        }
      }
    }
  });

  return (
    <div className="bg-background-dark text-white min-h-screen">
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="space-y-6">
              <h3 className="font-serif flex items-center gap-3 text-white uppercase tracking-widest text-sm">
                <Filter size={18} className="text-primary" />
                Categories
              </h3>
              <ul className="space-y-4 border-l border-primary/20 ml-2 pl-5">
                <li>
                  <Link href="/products" className={`flex items-center justify-between group transition-colors py-1 ${!categoryId ? "text-primary" : "hover:text-primary text-zinc-400"}`}>
                    <span className="font-bold text-xs uppercase tracking-widest">All Collections</span>
                  </Link>
                </li>
                {categoriesDb.map((cat: { id: string, name: string, _count: { products: number } }) => (
                  <CategoryLink key={cat.id} id={cat.id} name={cat.name} count={cat._count.products} isActive={categoryId === cat.id} />
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl font-bold bg-linear-to-r from-primary via-white to-white bg-clip-text text-transparent transform -translate-x-1">
              Sacred Collections
            </h1>
            <p className="text-zinc-500 max-w-2xl font-serif italic text-lg leading-relaxed">
              Hand-selected artifacts energized for meditation and spiritual elevation. Each piece carries the essence of timeless devotion.
            </p>
            
            <div className="pt-4 flex items-center justify-between border-b border-primary/10 pb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                Manifesting {products.length} Items
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Sort by:</span>
                <SortSelect currentSort={sort} />
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="h-[40vh] flex flex-col items-center justify-center bg-white/5 border border-primary/10 rounded-2xl space-y-8">
              <ShoppingBag className="text-primary/20" size={64} strokeWidth={1} />
              <p className="text-zinc-600 font-serif italic text-2xl tracking-widest text-center px-6">Your vessel is empty. Begin your journey.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: Product) => (
                <ProductCardStitch key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination totalPages={totalPages} currentPage={page} />
        </div>
      </main>
    </div>
  );
}

function CategoryLink({ id, name, count, isActive }: { id?: string, name: string, count: number, isActive?: boolean }) {
  return (
    <li>
      <Link href={id ? `/products?category=${id}` : `/products`} className={`flex items-center justify-between group py-1 transition-colors ${isActive ? "text-primary" : "hover:text-primary text-zinc-400"}`}>
        <span className="text-xs font-medium">{name}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-primary" : "text-zinc-600 group-hover:text-primary"}`}>{count}</span>
      </Link>
    </li>
  );
}
