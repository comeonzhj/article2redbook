function parseJson(jsonText) {
    try {
        const data = JSON.parse(jsonText);
        
        // 验证数据结构
        if (!data.cards || !data.notes) {
            throw new Error('JSON结构不完整，缺少必要的cards或notes字段');
        }

        if (!data.cards.CoverCard || !data.cards.detailCards) {
            throw new Error('cards结构不完整，缺少CoverCard或detailCards字段');
        }

        if (!Array.isArray(data.cards.detailCards)) {
            throw new Error('detailCards必须是数组');
        }

        // 验证notes结构
        if (!data.notes.title || !data.notes.content || !data.notes.tags || !Array.isArray(data.notes.comments)) {
            throw new Error('notes结构不完整');
        }

        // 处理可能的特殊字符
        sanitizeData(data);

        return data;
    } catch (error) {
        console.error('JSON解析错误:', error);
        alert('JSON格式错误: ' + error.message);
        return null;
    }
}

function sanitizeData(data) {
    // 递归处理所有字符串值
    function sanitizeString(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function recursiveSanitize(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                recursiveSanitize(obj[key]);
            }
        }
    }

    recursiveSanitize(data);
    return data;
}

function getKnowledgePoints(detailCard) {
    const points = [];
    const pointRegex = /^point(\d+)$/;
    const descRegex = /^point(\d+)_desc$/;

    // 验证输入
    if (!detailCard || !detailCard.knowledgePoints) {
        console.warn('Invalid detailCard or missing knowledgePoints');
        return [];
    }

    // 先收集所有的 point 和对应的序号
    const pointEntries = [];
    for (let key in detailCard.knowledgePoints) {
        const pointMatch = key.match(pointRegex);
        if (pointMatch) {
            const index = parseInt(pointMatch[1]);
            const descKey = `point${index}_desc`;
            pointEntries.push({
                index,
                point: detailCard.knowledgePoints[key],
                description: detailCard.knowledgePoints[descKey] || ''
            });
        }
    }

    // 按照序号排序
    pointEntries.sort((a, b) => a.index - b.index);

    // 转换为最终格式
    return pointEntries.map(entry => ({
        point: entry.point,
        description: entry.description
    }));
}