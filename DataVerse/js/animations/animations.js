/**
 * DataVerse - Animation Engine
 * Reusable D3.js and GSAP animations for educational concepts
 */

// Animation configuration
const AnimationConfig = {
    duration: 2000,
    ease: 'easeInOut',
    colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    }
};

/**
 * Base Animation Class
 */
class BaseAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }
        this.svg = null;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 400;
    }

    init() {
        d3.select(this.container).selectAll('*').remove();
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    }

    clear() {
        d3.select(this.container).selectAll('*').remove();
    }
}

/**
 * Data Cleaning Pipeline Animation
 * Shows the transformation from raw data to clean dataset
 */
class DataCleaningAnimation extends BaseAnimation {
    constructor(containerId) {
        super(containerId);
        this.stages = [
            { name: 'Raw Data', icon: '📊', color: AnimationConfig.colors.error },
            { name: 'Missing Values', icon: '❓', color: AnimationConfig.colors.warning },
            { name: 'Duplicates', icon: '🔄', color: AnimationConfig.colors.warning },
            { name: 'Outliers', icon: '⚠️', color: AnimationConfig.colors.accent },
            { name: 'Encoding', icon: '🔧', color: AnimationConfig.colors.primary },
            { name: 'Scaling', icon: '📏', color: AnimationConfig.colors.primary },
            { name: 'Clean Dataset', icon: '✨', color: AnimationConfig.colors.success }
        ];
        this.currentStage = 0;
    }

    init() {
        super.init();
        this.drawPipeline();
        this.animate();
    }

    drawPipeline() {
        const stageWidth = this.width / this.stages.length;
        const centerY = this.height / 2;

        // Draw connecting lines
        this.svg.selectAll('.connector')
            .data(this.stages.slice(0, -1))
            .enter()
            .append('line')
            .attr('class', 'connector')
            .attr('x1', (d, i) => (i + 1) * stageWidth - 30)
            .attr('y1', centerY)
            .attr('x2', (d, i) => (i + 1) * stageWidth + 30)
            .attr('y2', centerY)
            .attr('stroke', '#e2e8f0')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '10,5');

        // Draw stages
        this.stages.forEach((stage, index) => {
            const group = this.svg.append('g')
                .attr('class', 'stage')
                .attr('transform', `translate(${(index + 0.5) * stageWidth}, ${centerY})`);

            // Circle background
            group.append('circle')
                .attr('r', 40)
                .attr('fill', stage.color)
                .attr('opacity', 0.2)
                .attr('class', `stage-${index}`);

            // Icon
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', 5)
                .attr('font-size', '24px')
                .text(stage.icon)
                .attr('class', `stage-${index}`);

            // Label
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', 70)
                .attr('font-size', '12px')
                .attr('fill', '#64748b')
                .attr('font-weight', '600')
                .text(stage.name)
                .attr('class', `stage-${index}`);
        });
    }

    animate() {
        let currentIndex = 0;
        
        const animateStage = () => {
            if (currentIndex >= this.stages.length) {
                currentIndex = 0;
                this.reset();
            }

            // Highlight current stage
            d3.selectAll('.stage circle')
                .transition()
                .duration(500)
                .attr('opacity', 0.2);

            d3.select(`.stage-${currentIndex} circle`)
                .transition()
                .duration(500)
                .attr('opacity', 1)
                .attr('r', 50);

            // Animate connector
            if (currentIndex > 0) {
                const connector = this.svg.selectAll('.connector')
                    .nodes()[currentIndex - 1];
                
                d3.select(connector)
                    .transition()
                    .duration(500)
                    .attr('stroke', this.stages[currentIndex].color)
                    .attr('stroke-width', 5)
                    .attr('stroke-dasharray', '0,0');
            }

            currentIndex++;
            setTimeout(animateStage, 1500);
        };

        animateStage();
    }

    reset() {
        d3.selectAll('.stage circle')
            .transition()
            .duration(500)
            .attr('r', 40)
            .attr('opacity', 0.2);

        d3.selectAll('.connector')
            .transition()
            .duration(500)
            .attr('stroke', '#e2e8f0')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '10,5');
    }
}

/**
 * SQL JOIN Animation
 * Visualizes how two tables merge based on JOIN type
 */
class SQLJoinAnimation extends BaseAnimation {
    constructor(containerId, joinType = 'INNER') {
        super(containerId);
        this.joinType = joinType;
        this.table1Data = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
        ];
        this.table2Data = [
            { id: 2, order: 'Order A' },
            { id: 3, order: 'Order B' },
            { id: 4, order: 'Order C' }
        ];
    }

    init() {
        super.init();
        this.drawTables();
        this.animateJoin();
    }

    drawTables() {
        const tableWidth = 120;
        const tableHeight = 150;
        const startY = 50;

        // Table 1
        this.drawTable(50, startY, tableWidth, tableHeight, 'Customers', this.table1Data, ['id', 'name']);
        
        // Table 2
        this.drawTable(this.width - 170, startY, tableWidth, tableHeight, 'Orders', this.table2Data, ['id', 'order']);

        // JOIN label in center
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', startY + tableHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('fill', AnimationConfig.colors.primary)
            .text(`${this.joinType} JOIN`);
    }

    drawTable(x, y, width, height, title, data, columns) {
        const tableGroup = this.svg.append('g')
            .attr('class', 'table');

        // Table background
        tableGroup.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'white')
            .attr('stroke', AnimationConfig.colors.primary)
            .attr('stroke-width', 2)
            .attr('rx', 8);

        // Header
        tableGroup.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', 30)
            .attr('fill', AnimationConfig.colors.primary)
            .attr('rx', 8);

        tableGroup.append('text')
            .attr('x', x + width / 2)
            .attr('y', y + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '12px')
            .text(title);

        // Data rows
        data.forEach((row, index) => {
            const rowY = y + 35 + index * 35;
            
            tableGroup.append('line')
                .attr('x1', x)
                .attr('y1', rowY)
                .attr('x2', x + width)
                .attr('y2', rowY)
                .attr('stroke', '#e2e8f0');

            columns.forEach((col, colIndex) => {
                tableGroup.append('text')
                    .attr('x', x + 10 + colIndex * 55)
                    .attr('y', rowY + 20)
                    .attr('font-size', '10px')
                    .attr('fill', '#64748b')
                    .text(row[col]);
            });
        });
    }

    animateJoin() {
        const resultX = this.width / 2 - 100;
        const resultY = 250;
        
        // Animate matching rows coming together
        const matches = [
            { id: 2, from1: this.table1Data[1], from2: this.table2Data[0] },
            { id: 3, from1: this.table1Data[2], from2: this.table2Data[1] }
        ];

        matches.forEach((match, index) => {
            setTimeout(() => {
                // Draw connection lines
                this.svg.append('line')
                    .attr('x1', 170)
                    .attr('y1', 120 + index * 35)
                    .attr('x2', resultX + 50)
                    .attr('y2', resultY + 70 + index * 40)
                    .attr('stroke', AnimationConfig.colors.accent)
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '5,5')
                    .attr('opacity', 0)
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                this.svg.append('line')
                    .attr('x1', this.width - 170)
                    .attr('y1', 120 + index * 35)
                    .attr('x2', resultX + 150)
                    .attr('y2', resultY + 70 + index * 40)
                    .attr('stroke', AnimationConfig.colors.accent)
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '5,5')
                    .attr('opacity', 0)
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);
            }, index * 1000);
        });

        // Show result table after delay
        setTimeout(() => {
            this.drawResultTable(resultX, resultY, matches);
        }, 2500);
    }

    drawResultTable(x, y, matches) {
        const tableWidth = 200;
        const tableHeight = 120;

        const resultGroup = this.svg.append('g')
            .attr('class', 'result-table');

        // Result table background
        resultGroup.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', tableWidth)
            .attr('height', tableHeight)
            .attr('fill', 'white')
            .attr('stroke', AnimationConfig.colors.success)
            .attr('stroke-width', 2)
            .attr('rx', 8)
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);

        // Header
        resultGroup.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', tableWidth)
            .attr('height', 30)
            .attr('fill', AnimationConfig.colors.success)
            .attr('rx', 8);

        resultGroup.append('text')
            .attr('x', x + tableWidth / 2)
            .attr('y', y + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '12px')
            .text('Result');

        // Result data
        matches.forEach((match, index) => {
            const rowY = y + 35 + index * 35;
            
            resultGroup.append('line')
                .attr('x1', x)
                .attr('y1', rowY)
                .attr('x2', x + tableWidth)
                .attr('y2', rowY)
                .attr('stroke', '#e2e8f0');

            resultGroup.append('text')
                .attr('x', x + 10)
                .attr('y', rowY + 20)
                .attr('font-size', '10px')
                .attr('fill', '#64748b')
                .text(match.id);

            resultGroup.append('text')
                .attr('x', x + 50)
                .attr('y', rowY + 20)
                .attr('font-size', '10px')
                .attr('fill', '#64748b')
                .text(match.from1.name);

            resultGroup.append('text')
                .attr('x', x + 120)
                .attr('y', rowY + 20)
                .attr('font-size', '10px')
                .attr('fill', '#64748b')
                .text(match.from2.order);
        });
    }
}

/**
 * Statistics Distribution Animation
 * Shows how data distribution changes with different parameters
 */
class DistributionAnimation extends BaseAnimation {
    constructor(containerId) {
        super(containerId);
        this.mean = this.width / 2;
        this.stdDev = 50;
    }

    init() {
        super.init();
        this.drawAxes();
        this.drawDistribution();
        this.addControls();
        this.animate();
    }

    drawAxes() {
        const padding = 50;
        
        // X-axis
        this.svg.append('line')
            .attr('x1', padding)
            .attr('y1', this.height - padding)
            .attr('x2', this.width - padding)
            .attr('y2', this.height - padding)
            .attr('stroke', '#64748b')
            .attr('stroke-width', 2);

        // Y-axis
        this.svg.append('line')
            .attr('x1', padding)
            .attr('y1', this.height - padding)
            .attr('x2', padding)
            .attr('y2', padding)
            .attr('stroke', '#64748b')
            .attr('stroke-width', 2);

        // Labels
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .text('Value');

        this.svg.append('text')
            .attr('x', 20)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('transform', `rotate(-90, 20, ${this.height / 2})`)
            .text('Frequency');
    }

    drawDistribution() {
        const padding = 50;
        const graphWidth = this.width - 2 * padding;
        const graphHeight = this.height - 2 * padding;

        // Generate normal distribution path
        const points = [];
        for (let x = 0; x <= graphWidth; x += 2) {
            const normalizedX = (x - this.mean + padding) / this.stdDev;
            const y = Math.exp(-0.5 * normalizedX * normalizedX);
            points.push([x + padding, this.height - padding - y * graphHeight * 0.8]);
        }

        const line = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);

        this.svg.append('path')
            .datum(points)
            .attr('class', 'distribution-curve')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', AnimationConfig.colors.primary)
            .attr('stroke-width', 3);

        // Fill area under curve
        this.svg.append('path')
            .datum(points)
            .attr('class', 'distribution-fill')
            .attr('d', line)
            .attr('fill', AnimationConfig.colors.primary)
            .attr('opacity', 0.2);
    }

    addControls() {
        // Add interactive controls (simplified version)
        const controlGroup = this.svg.append('g')
            .attr('transform', `translate(${this.width - 150}, 30)`);

        controlGroup.append('text')
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text('Mean: ' + Math.round(this.mean));

        controlGroup.append('text')
            .attr('y', 20)
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text('Std Dev: ' + Math.round(this.stdDev));
    }

    animate() {
        // Animate standard deviation changes
        let increasing = true;
        
        const animate = () => {
            if (increasing) {
                this.stdDev += 2;
                if (this.stdDev >= 80) increasing = false;
            } else {
                this.stdDev -= 2;
                if (this.stdDev <= 30) increasing = true;
            }

            this.updateDistribution();
            requestAnimationFrame(animate);
        };

        setTimeout(animate, 1000);
    }

    updateDistribution() {
        const padding = 50;
        const graphWidth = this.width - 2 * padding;
        const graphHeight = this.height - 2 * padding;

        const points = [];
        for (let x = 0; x <= graphWidth; x += 2) {
            const normalizedX = (x - this.mean + padding) / this.stdDev;
            const y = Math.exp(-0.5 * normalizedX * normalizedX);
            points.push([x + padding, this.height - padding - y * graphHeight * 0.8]);
        }

        const line = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);

        d3.select('.distribution-curve')
            .transition()
            .duration(100)
            .attr('d', line);

        d3.select('.distribution-fill')
            .transition()
            .duration(100)
            .attr('d', line);
    }
}

/**
 * Machine Learning Training Animation
 * Visualizes model training process
 */
class MLTrainingAnimation extends BaseAnimation {
    constructor(containerId) {
        super(containerId);
        this.dataPoints = [];
        this.line = null;
        this.epoch = 0;
    }

    init() {
        super.init();
        this.generateData();
        this.drawDataPoints();
        this.drawInitialLine();
        this.animateTraining();
    }

    generateData() {
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * (this.width - 100) + 50;
            const y = 0.5 * x + Math.random() * 100 - 50 + 50;
            this.dataPoints.push({ x, y });
        }
    }

    drawDataPoints() {
        this.svg.selectAll('.data-point')
            .data(this.dataPoints)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 5)
            .attr('fill', AnimationConfig.colors.primary)
            .attr('opacity', 0.6);
    }

    drawInitialLine() {
        this.line = this.svg.append('line')
            .attr('x1', 50)
            .attr('y1', this.height / 2)
            .attr('x2', this.width - 50)
            .attr('y2', this.height / 2)
            .attr('stroke', AnimationConfig.colors.error)
            .attr('stroke-width', 3);
    }

    animateTraining() {
        const targetSlope = 0.5;
        const targetIntercept = 50;
        let currentSlope = 0;
        let currentIntercept = this.height / 2;

        const animate = () => {
            this.epoch++;
            
            // Gradually approach target
            currentSlope += (targetSlope - currentSlope) * 0.05;
            currentIntercept += (targetIntercept - currentIntercept) * 0.05;

            const x1 = 50;
            const y1 = currentSlope * x1 + currentIntercept;
            const x2 = this.width - 50;
            const y2 = currentSlope * x2 + currentIntercept;

            this.line
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2);

            // Update line color based on convergence
            const progress = 1 - Math.abs(currentSlope - targetSlope) / targetSlope;
            const r = Math.round(239 * (1 - progress));
            const g = Math.round(68 * progress);
            const b = Math.round(68 * progress);
            
            this.line.attr('stroke', `rgb(${r}, ${g}, ${b})`);

            if (this.epoch < 100) {
                setTimeout(animate, 50);
            } else {
                this.showTrainingComplete();
            }
        };

        setTimeout(animate, 500);
    }

    showTrainingComplete() {
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', AnimationConfig.colors.success)
            .text('✓ Training Complete!')
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);
    }
}

// Export animation classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationConfig,
        BaseAnimation,
        DataCleaningAnimation,
        SQLJoinAnimation,
        DistributionAnimation,
        MLTrainingAnimation
    };
}
