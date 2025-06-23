export default function Contact() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">your.email@example.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Social Media</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-blue-600 hover:text-blue-800">
                    GitHub
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-800">
                    LinkedIn
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-800">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Contact Form</h2>
            <p className="text-gray-600 bg-gray-100 p-4 rounded-lg">
              お問い合わせフォームは保留中です
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}