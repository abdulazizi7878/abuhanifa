// overview.service.js

import {
    getCounts,
    getEstimateStatusCounts,
    getRecentEstimates,
    getRecentMaterials,
    getRecentOrderedProducts,
} from "@/repositories/overview.repository";

const getOverview = async () => {
    const [
        counts,
        estimateStatuses,
        recentEstimates,
        recentMaterials,
        recentOrderedProducts,
    ] = await Promise.all([
        getCounts(),
        getEstimateStatusCounts(),
        getRecentEstimates(5),
        getRecentMaterials(5),
        getRecentOrderedProducts(5),
    ]);

    return {
        stats: {
            blogs: counts.blogs,
            products: counts.products,
            materials: counts.materials,
            promotions: counts.promotions,
            orders: counts.orders,
            estimates: counts.estimates,
            contacts: counts.contacts,
            comments: counts.comments,
            orderedProducts: counts.orderedProducts,
        },

        estimates: {
            total: counts.estimates,
            status: estimateStatuses,
        },

        recent: {
            estimates: recentEstimates,
            materials: recentMaterials,
            orderedProducts: recentOrderedProducts,
        },
    };
};

export { getOverview };