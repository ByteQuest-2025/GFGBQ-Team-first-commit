document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        const btn = document.getElementById('buy-btn');
        if(btn) {
            btn.innerHTML = "Log in to Upgrade";
            btn.onclick = () => window.location.href = 'index.html';
        }
    } else {
        // Check if already Pro
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', session.user.id)
            .single();

        if (profile && profile.is_pro) {
            const btn = document.getElementById('buy-btn');
            if(btn) {
                btn.innerHTML = "You are already Pro <i class='fas fa-check'></i>";
                btn.disabled = true;
                btn.classList.add('bg-green-600', 'text-white');
            }
        }
    }

    // 2. Load Price
    loadProductData();
});

async function loadProductData() {
    try {
        // SECURE CALL: Ask Server for Price
        const { data, error } = await supabase.functions.invoke('payment-handler', {
            body: { action: 'get-product' }
        });

        if (error) throw error;

        // Format Price
        const price = (data.price / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        
        const display = document.getElementById('price-display');
        if(display) display.innerText = price;

    } catch (e) {
        console.error("Failed to load product:", e);
        document.getElementById('price-display').innerText = "$10.00";
    }
}

async function buyPro() {
    const btn = document.getElementById('buy-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        // 1. Get User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        // 2. SECURE CALL: Create Checkout on Server
        const { data, error } = await supabase.functions.invoke('payment-handler', {
            body: { 
                action: 'create-checkout',
                email: user.email,
                name: user.user_metadata.full_name,
                user_id: user.id
            }
        });

        if (error) throw error;
        const checkoutUrl = data.url;

        // 3. Open Overlay
        if (checkoutUrl) {
            LemonSqueezy.Url.Open(checkoutUrl);
            
            // Listen for Success
            LemonSqueezy.Setup({
                eventHandler: async (event) => {
                    if (event.event === 'Checkout.Success') {
                        
                        btn.innerHTML = '<i class="fas fa-check"></i> Activating Pro...';

                        try {
                            // Update DB
                            await supabase.from('profiles')
                                .update({ 
                                    is_pro: true, 
                                    subscription_id: 'paid_via_client' 
                                })
                                .eq('id', user.id);

                            alert("Upgrade Successful! Welcome to TwinAI Pro.");
                            window.location.href = 'app.html';

                        } catch (dbError) {
                            console.error("DB Update Failed:", dbError);
                            alert("Payment successful, but account update failed. Contact support.");
                            window.location.href = 'app.html';
                        }
                    }
                }
            });
        } else {
            throw new Error("No URL returned");
        }

    } catch (e) {
        console.error(e);
        alert("Checkout Error: " + e.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}