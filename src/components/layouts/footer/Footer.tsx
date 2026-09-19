import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="flex items-center justify-center gap-2 py-10">
          <span>Project by</span>

          <figure className="flex items-center gap-2">
            <Image src="/nice-avatar.png" alt="Ömer Gülçiçek Avatar" width={32} height={32} />
            <figcaption>
              <Link
                href="https://omergulcicek.com?utm_source=nextjs-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline"
              >
                Ömer Gülçiçek
              </Link>
            </figcaption>
          </figure>
        </div>
      </div>
    </footer>
  );
}
