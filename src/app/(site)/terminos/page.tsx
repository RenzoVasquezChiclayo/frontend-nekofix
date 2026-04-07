import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { SITE_CONTACT } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Condiciones de uso del sitio web y compras en ${SITE_NAME}.`,
  openGraph: {
    title: `Términos y condiciones · ${SITE_NAME}`,
    description: `Condiciones de uso y servicios de ${SITE_NAME}.`,
  },
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
        Términos y condiciones
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        Última actualización: {new Date().getFullYear()}. Al usar este sitio aceptas lo siguiente.
      </p>

      <div className="prose prose-zinc prose-headings:font-semibold mt-10 max-w-none text-sm leading-relaxed text-zinc-700">
        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">1. Información general</h2>
          <p className="mt-3">
            El sitio web de <strong>{SITE_NAME}</strong> (en adelante, “el sitio”) tiene como finalidad
            informar sobre productos, servicios técnicos y permitir canales de contacto y cotización. Los
            datos publicados (precios, stock, imágenes y descripciones) se ofrecen de buena fe y pueden
            actualizarse sin previo aviso.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">2. Uso del sitio</h2>
          <p className="mt-3">
            Te comprometes a utilizar el sitio de forma lícita, sin intentar dañar, sobrecargar o interferir
            con su funcionamiento. Nos reservamos el derecho de restringir el acceso ante usos abusivos o
            contrarios a la ley aplicable en el Perú.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">3. Productos y servicios</h2>
          <p className="mt-3">
            Las características de los equipos (incluido estado cosmético o grado en productos usados)
            se indican en la ficha de cada producto. La disponibilidad real se confirma en tienda o por los
            canales oficiales. Las reparaciones y tiempos estimados dependen del diagnóstico y de la
            disponibilidad de repuestos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">4. Precios y pagos</h2>
          <p className="mt-3">
            Los precios se muestran en moneda local salvo indicación contraria. Los impuestos o cargos
            aplicables se informarán al momento de concretar la compra o el servicio. Los pedidos por
            WhatsApp u otros medios quedan sujetos a confirmación de stock y condiciones acordadas en ese
            momento.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">5. Garantías y devoluciones</h2>
          <p className="mt-3">
            Las garantías sobre productos o intervenciones técnicas se rigen por lo acordado al momento de
            la compra o de la entrega del servicio y por la normativa aplicable. Para cualquier reclamo,
            contacta con nosotros con tu comprobante o referencia de pedido.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">6. Limitación de responsabilidad</h2>
          <p className="mt-3">
            {SITE_NAME} no se hace responsable por daños indirectos, lucro cesante o inconvenientes
            derivados del uso del sitio cuando no exista dolo o culpa grave atribuible. El sitio puede
            contener enlaces a terceros; su uso se rige por las políticas de esos sitios.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg text-zinc-900">7. Cambios</h2>
          <p className="mt-3">
            Podemos modificar estos términos publicando la versión actualizada en esta página. Se
            recomienda revisarla periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-zinc-900">8. Contacto</h2>
          <p className="mt-3">
            Para consultas sobre estos términos o sobre nuestros servicios, escríbenos a{" "}
            <a
              href={`mailto:${SITE_CONTACT.email}`}
              className="font-medium text-primary-700 underline-offset-2 hover:underline"
            >
              {SITE_CONTACT.email}
            </a>{" "}
            o utiliza los datos de contacto publicados en la sección{" "}
            <a href="/contacto" className="font-medium text-primary-700 underline-offset-2 hover:underline">
              Contacto
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
