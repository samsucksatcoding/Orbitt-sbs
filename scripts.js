document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.querySelector('.tooltip');

    // Initial hidden and transparent state
    tooltip.style.display = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s ease';

    function capitalizeWords(str) {
        return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    document.body.addEventListener('mouseover', e => {
        let target = e.target;

        // Use the iframe's ID if it's the hovered element
        if (target.tagName === 'IFRAME' && target.id) {
            tooltip.innerText = capitalizeWords(target.id);
        }
        // Otherwise, try to find the nearest parent with an ID
        else {
            const parentWithId = target.closest('[id]');
            if (!parentWithId || parentWithId.tagName === 'BODY' || parentWithId === document.documentElement) {
                tooltip.style.opacity = '0';
                return;
            }
            tooltip.innerText = capitalizeWords(parentWithId.id);
        }

        tooltip.style.display = 'inline-block';
        tooltip.style.opacity = '1';
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    });

    document.body.addEventListener('mousemove', e => {
        if (tooltip.style.display !== 'none') {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    });

    document.body.addEventListener('mouseout', () => {
        tooltip.style.opacity = '0';
    });

    tooltip.addEventListener('transitionend', () => {
        if (tooltip.style.opacity === '0') {
            tooltip.style.display = 'none';
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const bannerImg = document.querySelector("#header img");

    // Create a test image to measure load time
    const testImg = new Image();
    const start = performance.now();

    testImg.onload = () => {
        const duration = performance.now() - start;
        // If loading the GIF took too long, switch to PNG
        if (duration > 2000) {
            bannerImg.src = "./assets/images/banner.png";
            console.log("Switched to PNG due to slow connection.");
        }
    };

    testImg.onerror = () => {
        // If loading fails, fallback to PNG
        bannerImg.src = "./assets/images/banner.png";
        console.log("GIF failed to load, using PNG fallback.");
    };

    testImg.src = "./assets/images/banner.gif";
});