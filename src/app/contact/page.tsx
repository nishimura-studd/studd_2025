export default function Contact() {
  return (
    <div className="min-h-screen">
      <section className="swiss-section" style={{paddingLeft: '200px'}}>
        <div className="max-w-4xl px-8">
          <h1 className="mb-16">Contact</h1>
          
          <div className="space-y-16">
            <article>
              <h2 className="mb-6">Get in Touch</h2>
              <div className="swiss-line mb-8" style={{height: '2px'}}></div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3">Email</h3>
                  <p className="text-gray-600">your.email@example.com</p>
                </div>
                
                <div>
                  <h3 className="mb-4">Social Media</h3>
                  <div className="space-y-3">
                    <a href="#" className="block border-b border-black pb-1 w-fit hover:bg-black hover:text-white transition-all duration-200">
                      GitHub
                    </a>
                    <a href="#" className="block border-b border-black pb-1 w-fit hover:bg-black hover:text-white transition-all duration-200">
                      LinkedIn
                    </a>
                    <a href="#" className="block border-b border-black pb-1 w-fit hover:bg-black hover:text-white transition-all duration-200">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <article>
              <h2 className="mb-6">Contact Form</h2>
              <div className="swiss-line mb-8" style={{height: '2px'}}></div>
              <div className="border border-black p-8 bg-gray-50">
                <p className="font-mono text-sm uppercase tracking-wider text-center text-gray-600">
                  お問い合わせフォームは保留中です
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}