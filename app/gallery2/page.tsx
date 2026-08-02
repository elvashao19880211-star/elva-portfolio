import Image from "next/image";

export default function Gallery2() {
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Gallery 2</h1>
      <div className="grid grid-cols-3 gap-4">
        <Image src="/image-one.png" alt="图1" width={400} height={300} />
        <Image src="/image-two.png" alt="图2" width={400} height={300} />
        <Image src="/image-three.png" alt="图3" width={400} height={300} />
      </div>
    </main>
  );
}